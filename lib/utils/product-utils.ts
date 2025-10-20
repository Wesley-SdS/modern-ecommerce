import type { Product } from "@/types/product"

export function parseProductImages(images: unknown): string[] {
  if (Array.isArray(images)) return images
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

export function formatProductPrice(priceCents: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "pt-BR" ? "BRL" : "USD",
  }).format(priceCents / 100)
}

export function getProductStockStatus(stock: number): "in-stock" | "low-stock" | "out-of-stock" {
  if (stock === 0) return "out-of-stock"
  if (stock < 10) return "low-stock"
  return "in-stock"
}

export function getProductStockLabel(stock: number): string {
  const status = getProductStockStatus(stock)
  switch (status) {
    case "in-stock":
      return "Em Estoque"
    case "low-stock":
      return "Últimas Unidades"
    case "out-of-stock":
      return "Fora de Estoque"
  }
}

export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}