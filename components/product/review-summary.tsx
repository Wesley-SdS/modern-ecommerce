import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ReviewSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{ rating: number; count: number }>
  className?: string
}

export function ReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  className,
}: ReviewSummaryProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 3.5) return "text-yellow-600"
    if (rating >= 2.5) return "text-orange-600"
    return "text-red-600"
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Excelente"
    if (rating >= 3.5) return "Bom"
    if (rating >= 2.5) return "Regular"
    return "Ruim"
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className={cn("text-4xl font-bold", getRatingColor(averageRating))}>
            {averageRating.toFixed(1)}
          </span>
          <div className="flex flex-col">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {getRatingLabel(averageRating)}
            </span>
          </div>
        </div>
        
        <Badge variant="outline" className="text-sm">
          {totalReviews} avaliação{totalReviews !== 1 ? "ões" : ""}
        </Badge>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const distribution = ratingDistribution.find(r => r.rating === rating)
          const count = distribution?.count || 0
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              
              <div className="flex-1">
                <Progress value={percentage} className="h-2" />
              </div>
              
              <div className="w-12 text-right text-sm text-muted-foreground">
                {percentage.toFixed(0)}%
              </div>
              
              <div className="w-8 text-right text-sm text-muted-foreground">
                ({count})
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}