"use client"

import { useState, useEffect, Suspense } from "react"
import React from "react"
import { useSearchParams } from "next/navigation"
import { SearchBar } from "@/components/shared/search-bar"
import { ProductCard } from "@/components/shared/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, X, Grid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product, ProductFilters } from "@/types/product"

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating" | "newest"

interface SearchPageProps {}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filters, setFilters] = useState<ProductFilters>({
    search: initialQuery,
    page: 1,
    limit: 12,
  })
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const fetchSearchResults = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append("search", filters.search)
      if (filters.page) params.append("page", filters.page.toString())
      if (filters.limit) params.append("limit", filters.limit.toString())
      if (sortBy !== "relevance") params.append("sortBy", sortBy)
      if (priceRange?.[0] && priceRange[0] > 0) params.append("minPrice", priceRange[0].toString())
      if (priceRange?.[1] && priceRange[1] < 1000) params.append("maxPrice", priceRange[1].toString())
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(cat => params.append("category", cat))
      }
      if (inStockOnly) params.append("inStock", "true")

      const response = await fetch(`/api/v1/search?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data || [])
        setTotalProducts(data.total || 0)
        setCategories(data.categories || [])
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch search results:", error)
    } finally {
      setIsLoading(false)
    }
  }, [filters, sortBy, priceRange, selectedCategories, inStockOnly])

  useEffect(() => {
    fetchSearchResults()
  }, [filters, sortBy, priceRange, selectedCategories, inStockOnly])

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setFilters(prev => ({ ...prev, search: newQuery, page: 1 }))
  }

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
  }

  const handleCategoryToggle = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category])
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category))
    }
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    setSelectedCategories([])
    setInStockOnly(false)
    setFilters(prev => ({ ...prev, page: 1 }))
  }

  const activeFilterCount = [
    priceRange?.[0] && priceRange[0] > 0,
    priceRange?.[1] && priceRange[1] < 1000,
    selectedCategories.length > 0,
    inStockOnly,
  ].filter(Boolean).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                {query ? `Resultados para "${query}"` : "Todos os Produtos"}
              </h1>
              {totalProducts > 0 && (
                <p className="text-muted-foreground">
                  {totalProducts} produto{totalProducts !== 1 ? "s" : ""} encontrado{totalProducts !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <SearchBar
                placeholder="Buscar produtos..."
                className="w-full lg:w-80"
                showSuggestions={true}
              />
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="rating">Melhor Avaliação</SelectItem>
                  <SelectItem value="newest">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>

              {activeFilterCount > 0 && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={cn(
            "w-64 space-y-6",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Filtros
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary">{activeFilterCount}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <h4 className="font-medium">Faixa de Preço</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>R$ {priceRange[0]}</span>
                    <span>R$ {priceRange[1]}</span>
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Categorias</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => 
                              handleCategoryToggle(category, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="space-y-3">
                  <h4 className="font-medium">Disponibilidade</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                    />
                    <label
                      htmlFor="inStock"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Apenas produtos em estoque
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              )}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold">
                    {query ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
                  </h3>
                  <p className="text-muted-foreground">
                    {query 
                      ? `Não encontramos resultados para &quot;${query}&quot;. Tente usar termos diferentes ou menos filtros.`
                      : "Não há produtos disponíveis no momento."
                    }
                  </p>
                  {activeFilterCount > 0 && (
                    <Button onClick={clearFilters}>
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              )}>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === "list" ? "flex flex-row" : ""}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalProducts > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={filters.page === 1}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                  >
                    Anterior
                  </Button>
                  
                  <span className="px-4 py-2 text-sm text-muted-foreground">
                    Página {filters.page} de {Math.ceil(totalProducts / (filters.limit || 12))}
                  </span>
                  
                  <Button
                    variant="outline"
                    disabled={filters.page! >= Math.ceil(totalProducts / (filters.limit || 12))}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}