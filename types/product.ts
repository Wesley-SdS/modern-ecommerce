export interface Product {
  id: string
  title: string
  slug: string
  description: string
  priceCents: number
  sku: string
  stock: number
  categoryId?: string
  images: string[]
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  attributes: Record<string, string | number>
  priceCents?: number
  stock: number
  images?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest" | "oldest"
  page?: number
  limit?: number
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  priceCents: number
  product: Product
  variant?: ProductVariant
}

export interface Wishlist {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: Date
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}