import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useAdvancedDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsLoading(false)
    }, delay)

    return () => {
      clearTimeout(handler)
      setIsLoading(false)
    }
  }, [value, delay])

  const cancel = () => {
    setDebouncedValue(value)
    setIsLoading(false)
  }

  return { debouncedValue, isLoading, cancel }
}