import { z } from "zod"

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().min(1, "Description is required"),
  priceCents: z.number().int().positive("Price must be positive"),
  sku: z.string().min(1, "SKU is required").max(50),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().optional(),
  images: z.array(z.string()).optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const adjustStockSchema = z.object({
  quantity: z.number().int(),
  note: z.string().optional(),
})
