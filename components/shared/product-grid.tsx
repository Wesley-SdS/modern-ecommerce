"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/shared/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  categories?: string[]
  onFilterChange?: (filters: ProductFilters) => void
  onSortChange?: (sort: SortOption) => void
  onPageChange?: (page: number) => void
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface ProductFilters {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  inStock: boolean
}

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest" | "popular"

export function ProductGrid({
  products,
  loading = false,
  categories = [],
  onFilterChange,
  onSortChange,
  onPageChange,
  pagination,
}: ProductGridProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: Number.MAX_SAFE_INTEGER,
    inStock: true,
  })

  const [sort, setSort] = useState<SortOption>("newest")
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(filters.search.toLowerCase())
      const matchesCategory = !filters.category || product.category?.name === filters.category
      const matchesPrice = product.priceCents >= filters.minPrice * 100 && product.priceCents <= filters.maxPrice * 100
      const matchesStock = !filters.inStock || product.stock > 0

      return matchesSearch && matchesCategory && matchesPrice && matchesStock
    })

    filtered.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.title.localeCompare(b.title)
        case "name-desc":
          return b.title.localeCompare(a.title)
        case "price-asc":
          return a.priceCents - b.priceCents
        case "price-desc":
          return b.priceCents - a.priceCents
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "popular":
          return b.stock - a.stock
        default:
          return 0
      }
    })

    return filtered
  }, [products, filters, sort])

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange?.(updatedFilters)
  }

  const updateSort = (newSort: SortOption) => {
    setSort(newSort)
    onSortChange?.(newSort)
  }

  const displayedProducts = pagination
    ? filteredAndSortedProducts.slice(
        (pagination.page - 1) * pagination.limit,
        pagination.page * pagination.limit
      )
    : filteredAndSortedProducts

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {(filters.category || filters.minPrice > 0 || filters.maxPrice < Number.MAX_SAFE_INTEGER) && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </Button>

          <Select value={sort} onValueChange={(value: SortOption) => updateSort(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) => updateFilters({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Min Price</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice || ""}
                onChange={(e) => updateFilters({ minPrice: Number(e.target.value) || 0 })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Max Price</label>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice === Number.MAX_SAFE_INTEGER ? "" : filters.maxPrice}
                onChange={(e) =>
                  updateFilters({
                    maxPrice: e.target.value ? Number(e.target.value) : Number.MAX_SAFE_INTEGER,
                  })
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => updateFilters({ search: "", category: "", minPrice: 0, maxPrice: Number.MAX_SAFE_INTEGER })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {displayedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found</p>
          <Button
            variant="outline"
            onClick={() => updateFilters({ search: "", category: "", minPrice: 0, maxPrice: Number.MAX_SAFE_INTEGER })}
            className="mt-4"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}