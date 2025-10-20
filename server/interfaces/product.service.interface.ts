import type { Product, Category, ProductFilters, PaginationResult } from "@/lib/types"

export interface IProductService {
  listProducts(params: {
    page?: number
    limit?: number
    search?: string
    category?: string
  }): Promise<PaginationResult<Product>>
  
  getProduct(idOrSlug: string): Promise<Product | null>
  
  createProduct(data: {
    title: string
    slug: string
    description: string
    priceCents: number
    sku: string
    stock: number
    categoryId?: string
    images?: string[]
  }): Promise<Product>
  
  updateProduct(
    id: string,
    data: {
      title?: string
      slug?: string
      description?: string
      priceCents?: number
      sku?: string
      categoryId?: string
      images?: string[]
    }
  ): Promise<Product>
  
  deleteProduct(id: string): Promise<void>
  
  adjustStock(id: string, quantity: number, note?: string): Promise<Product>
  
  getCategories(): Promise<Category[]>
  
  getProductsByCategory(categorySlug: string, params?: {
    page?: number
    limit?: number
  }): Promise<PaginationResult<Product>>
}