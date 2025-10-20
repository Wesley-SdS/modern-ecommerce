"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shared/product-card"
import { mockProducts } from "@/lib/mock-data"
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export default function HomePage() {
  const t = useTranslations("home")
  const featuredProducts = mockProducts.slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-muted/30 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty">{t("hero.description")}</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/products">
                    {t("hero.shopNow")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/products">{t("hero.browseCategories")}</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/summer-fashion-collection.png"
                alt="Featured collection"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("features.freeShipping.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.freeShipping.description")}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("features.securePayment.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.securePayment.description")}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-primary/10">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("features.support.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.support.description")}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-lg bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("features.easyReturns.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.easyReturns.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("featuredProducts.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              {t("featuredProducts.description")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">{t("featuredProducts.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("categories.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              {t("categories.description")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/products?category=electronics" className="group relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/modern-electronics.png"
                alt={t("categories.electronics")}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">{t("categories.electronics")}</h3>
              </div>
            </Link>
            <Link href="/products?category=fashion" className="group relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/summer-fashion-collection.png"
                alt={t("categories.fashion")}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">{t("categories.fashion")}</h3>
              </div>
            </Link>
            <Link
              href="/products?category=home"
              className="group relative h-64 rounded-lg overflow-hidden md:col-span-2 lg:col-span-1"
            >
              <Image
                src="/minimalist-desk-lamp.png"
                alt={t("categories.home")}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">{t("categories.home")}</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
