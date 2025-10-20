"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Algo deu errado!</h2>
          <p className="text-muted-foreground">
            {error.message || "Ocorreu um erro inesperado."}
          </p>
        </div>
        
        <div className="space-y-2">
          <Button onClick={reset} className="w-full">
            Tentar novamente
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
            className="w-full"
          >
            Voltar para página inicial
          </Button>
        </div>
        
        {process.env.NODE_ENV === "development" && error.digest && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer">
              Detalhes do erro
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}