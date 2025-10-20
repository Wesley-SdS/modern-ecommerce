"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ReviewForm } from "./review-form"
import { ReviewCard } from "./review-card"
import { ReviewSummary } from "./review-summary"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProductReview } from "@/types/product"

interface ProductReviewsProps {
  productId: string
  reviews: ProductReview[]
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{ rating: number; count: number }>
  onReviewSubmit?: (review: Omit<ProductReview, "id" | "userId" | "verified" | "helpful" | "createdAt" | "updatedAt">) => void
  onReviewHelpful?: (reviewId: string) => void
  className?: string
}

type SortOption = "recent" | "helpful" | "rating-high" | "rating-low"

export function ProductReviews({
  productId,
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  onReviewSubmit,
  onReviewHelpful,
  className,
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [filteredRating, setFilteredRating] = useState<string | null>(null)

  const sortReviews = (reviews: ProductReview[], sort: SortOption) => {
    const sorted = [...reviews]
    
    switch (sort) {
      case "recent":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "helpful":
        return sorted.sort((a, b) => b.helpful - a.helpful)
      case "rating-high":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "rating-low":
        return sorted.sort((a, b) => a.rating - b.rating)
      default:
        return sorted
    }
  }

  const filteredReviews = reviews.filter(review => 
    filteredRating ? review.rating.toString() === filteredRating : true
  )

  const sortedReviews = sortReviews(filteredReviews, sortBy)

  return (
    <div className={className}>
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">
            Avaliações ({totalReviews})
          </TabsTrigger>
          <TabsTrigger value="write">
            Escrever Avaliação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ReviewSummary
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingDistribution={ratingDistribution}
              />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4">
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais Recentes</SelectItem>
                      <SelectItem value="helpful">Mais Úteis</SelectItem>
                      <SelectItem value="rating-high">Maior Nota</SelectItem>
                      <SelectItem value="rating-low">Menor Nota</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filteredRating || ""} 
                    onValueChange={(value) => setFilteredRating(value === "" ? null : value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filtrar por nota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="5">5 estrelas</SelectItem>
                      <SelectItem value="4">4 estrelas</SelectItem>
                      <SelectItem value="3">3 estrelas</SelectItem>
                      <SelectItem value="2">2 estrelas</SelectItem>
                      <SelectItem value="1">1 estrela</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-muted-foreground">
                  {sortedReviews.length} de {totalReviews} avaliações
                </div>
              </div>

              <div className="space-y-4">
                {sortedReviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma avaliação encontrada.
                  </div>
                ) : (
                  sortedReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onHelpful={onReviewHelpful}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="write">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Escreva sua avaliação</h3>
              <p className="text-muted-foreground">
                Compartilhe sua experiência para ajudar outros clientes.
              </p>
            </div>
            
            <ReviewForm
              productId={productId}
              onSubmit={onReviewSubmit || (() => {})}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}