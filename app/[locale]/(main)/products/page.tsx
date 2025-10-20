import { getTranslations } from "next-intl/server"
import { ProductCard } from "@/components/shared/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

async function getProducts(searchParams: any) {
  try {
    const params = new URLSearchParams()
    if (searchParams.search) params.append("search", searchParams.search)
    if (searchParams.category) params.append("category", searchParams.category)
    if (searchParams.sort) params.append("sort", searchParams.sort)
    if (searchParams.page) params.append("page", searchParams.page)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/products?${params.toString()}`,
      { cache: "no-store" },
    )
    if (!res.ok) return { products: [], total: 0, page: 1, totalPages: 1 }
    return res.json()
  } catch (error) {
    return { products: [], total: 0, page: 1, totalPages: 1 }
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ search?: string; category?: string; sort?: string; page?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const t = await getTranslations("products")
  const { products, total, page, totalPages } = await getProducts(resolvedSearchParams)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle", { count: total })}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input placeholder={t("search")} defaultValue={resolvedSearchParams.search} className="md:w-80" />
          <Select defaultValue={resolvedSearchParams.category}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              <SelectItem value="electronics">{t("categories.electronics")}</SelectItem>
              <SelectItem value="clothing">{t("categories.clothing")}</SelectItem>
              <SelectItem value="accessories">{t("categories.accessories")}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={resolvedSearchParams.sort}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("sort.newest")}</SelectItem>
              <SelectItem value="price-asc">{t("sort.priceAsc")}</SelectItem>
              <SelectItem value="price-desc">{t("sort.priceDesc")}</SelectItem>
              <SelectItem value="popular">{t("sort.popular")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button key={pageNum} variant={pageNum === page ? "default" : "outline"} size="sm">
                {pageNum}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
