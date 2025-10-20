"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Hook para detectar quando um elemento entra/sai da viewport
 * Útil para lazy loading, animações on scroll, infinite scroll, etc.
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          setIsIntersecting(entry.isIntersecting)
          setEntry(entry)
        }
      },
      {
        threshold: 0,
        rootMargin: "0px",
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options])

  return { ref: elementRef, isIntersecting, entry }
}

/**
 * Hook para implementar infinite scroll
 */
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean = true,
  threshold: number = 0.1
) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin: "100px",
  })

  useEffect(() => {
    if (isIntersecting && hasMore) {
      callback()
    }
  }, [isIntersecting, hasMore, callback])

  return ref
}

/**
 * Hook para lazy loading de imagens
 */
export function useLazyImage(src: string, placeholder: string = "") {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  })

  useEffect(() => {
    if (isIntersecting && src && !isLoaded) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.src = src
    }
  }, [isIntersecting, src, isLoaded])

  return { ref, src: imageSrc, isLoaded }
}