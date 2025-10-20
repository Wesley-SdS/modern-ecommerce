"use client"

import { useState, useEffect, useCallback } from "react"

interface UseFetchOptions<T> {
  initialData?: T
  skip?: boolean
}

interface UseFetchReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useFetch<T>(url: string, options?: UseFetchOptions<T>): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(options?.initialData ?? null)
  const [loading, setLoading] = useState(!options?.skip)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"))
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    if (!options?.skip) {
      fetchData()
    }
  }, [url, options?.skip, fetchData])

  return { data, loading, error, refetch: fetchData }
}
