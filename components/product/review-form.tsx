"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProductReview } from "@/types/product"

interface ReviewFormProps {
  productId: string
  onSubmit: (review: Omit<ProductReview, "id" | "userId" | "verified" | "helpful" | "createdAt" | "updatedAt">) => void
  className?: string
}

export function ReviewForm({ productId, onSubmit, className }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
        images: [],
      })
      
      setRating(0)
      setTitle("")
      setComment("")
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to submit review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div>
        <label className="text-sm font-medium mb-2 block">Sua Avaliação</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              className="p-1 transition-colors"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  i < (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground hover:text-yellow-400"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <Input
        placeholder="Título da sua avaliação (opcional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="max-w-md"
      />

      <Textarea
        placeholder="Conte sua experiência com este produto..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />

      <Button 
        type="submit" 
        disabled={rating === 0 || isSubmitting}
        className="w-fit"
      >
        {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  )
}