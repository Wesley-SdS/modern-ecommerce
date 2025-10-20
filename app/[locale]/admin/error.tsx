"use client"

import ErrorBoundary from "@/components/error-boundary"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <ErrorBoundary error={error} reset={reset} />
      </div>
    </div>
  )
}