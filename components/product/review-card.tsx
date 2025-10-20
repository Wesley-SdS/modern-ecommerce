"use client"

import { Star, ThumbsUp, Calendar, Shield } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProductReview } from "@/types/product"

interface ReviewCardProps {
  review: ProductReview
  onHelpful?: (reviewId: string) => void
  className?: string
}

export function ReviewCard({ review, onHelpful, className }: ReviewCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className={cn("border rounded-lg p-4 space-y-3", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {review.userId.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Cliente</span>
              {review.verified && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Compra Verificada
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(review.createdAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          ))}
        </div>
      </div>

      {review.title && (
        <h4 className="font-semibold text-lg">{review.title}</h4>
      )}

      {review.comment && (
        <p className="text-muted-foreground leading-relaxed">
          {review.comment}
        </p>
      )}

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2">
          {review.images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="w-16 h-16 rounded-md overflow-hidden border"
            >
            <Image
              src={image}
              alt={`Review image ${index + 1}`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            </div>
          ))}
          {review.images.length > 3 && (
            <div className="w-16 h-16 rounded-md border bg-muted flex items-center justify-center text-sm text-muted-foreground">
              +{review.images.length - 3}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onHelpful?.(review.id)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Útil ({review.helpful})
        </Button>
      </div>
    </div>
  )
}