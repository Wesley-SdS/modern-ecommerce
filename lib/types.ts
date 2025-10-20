import { z } from "zod"

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priceCents: z.number(),
  currency: z.string(),
  images: z.array(z.string()),
  categoryId: z.string().nullable(),
  stock: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sku: z.string(),
  slug: z.string(),
  metadata: z.record(z.any()).optional(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }).nullable().optional(),
})

export const BannerSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  targetUrl: z.string().optional(),
  position: z.number(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
  name: z.string(),
  imageUrl: z.string(),
  sku: z.string(),
  slug: z.string(),
})

export const FinancialRecordSchema = z.object({
  id: z.string(),
  type: z.enum(["payable", "receivable"]),
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.date(),
  status: z.enum(["pending", "paid"]),
})

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["CUSTOMER", "ADMIN", "SUPER_ADMIN"]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const PaginationResultSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})

export type Product = z.infer<typeof ProductSchema>
export type Banner = z.infer<typeof BannerSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type FinancialRecord = z.infer<typeof FinancialRecordSchema>
export type User = z.infer<typeof UserSchema>
export type Category = z.infer<typeof CategorySchema>
export type PaginationResult<T = any> = z.infer<typeof PaginationResultSchema> & { data: T[] }

export type CreateUserInput = {
  email: string
  name: string
  passwordHash: string
  role?: User["role"]
}

export type UpdateUserInput = {
  name?: string
  email?: string
  role?: User["role"]
}

export type CreateBannerInput = {
  imageUrl: string
  targetUrl?: string
  position?: number
  active?: boolean
}

export type ProductFilters = {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest" | "popular"
