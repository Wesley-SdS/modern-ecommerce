"use client"

import ErrorBoundary from "@/components/error-boundary"

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto py-8">
      <ErrorBoundary error={error} reset={reset} />
    </div>
  )
}