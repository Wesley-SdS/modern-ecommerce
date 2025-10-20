"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Product Card Skeleton
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Page Loading
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Spinner className="h-8 w-8" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

// Button Loading
export function ButtonLoading({ children, loading, ...props }:
  { children: React.ReactNode; loading: boolean } & React.ComponentProps<"button">) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  )
}

// Form Loading Overlay
export function FormLoadingOverlay({ loading, children }: {
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <Spinner className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">Saving...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-2 space-y-1">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Table Loading
export function TableLoadingSkeleton({ rows = 5, columns = 4 }: {
  rows?: number
  columns?: number
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Chart Loading
export function ChartLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

// Image Loading with fallback
export function ImageWithLoading({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
  ...props
}: {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
} & React.ComponentProps<"img">) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          if (fallbackSrc) {
            const target = e.target as HTMLImageElement
            target.src = fallbackSrc
          }
        }}
      />
    </div>
  )
}