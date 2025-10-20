import type { ProductRepository } from "../repositories/product.repository"
import type { InventoryRepository } from "../repositories/inventory.repository"
import type { CategoryRepository } from "../repositories/category.repository"
import type { IProductService } from "../interfaces/product.service.interface"
import type { Product, Category, PaginationResult } from "@/lib/types"
import { parseProductImages } from "@/lib/utils/product-utils"

export class ProductService implements IProductService {
  constructor(
    private productRepo: ProductRepository,
    private inventoryRepo: InventoryRepository,
    private categoryRepo: CategoryRepository,
  ) {}

  async listProducts(params: {
    page?: number
    limit?: number
    search?: string
    category?: string
  }): Promise<PaginationResult<Product>> {
    const { page = 1, limit = 20, search, category } = params
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    const { products, total } = await this.productRepo.findAll({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: "desc" },
    })

    return {
      data: products.map(product => ({
        ...product,
        images: parseProductImages(product.images),
        metadata: product.metadata as Record<string, unknown> || undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getProduct(idOrSlug: string): Promise<Product | null> {
    const product = await this.productRepo.findById(idOrSlug)
    if (product) {
      return {
        ...product,
        images: parseProductImages(product.images),
        metadata: product.metadata as Record<string, unknown> || undefined,
      }
    }

    const slugProduct = await this.productRepo.findBySlug(idOrSlug)
    if (slugProduct) {
      return {
        ...slugProduct,
        images: parseProductImages(slugProduct.images),
        metadata: slugProduct.metadata as Record<string, unknown> || undefined,
      }
    }

    return null
  }

  async createProduct(data: {
    title: string
    slug: string
    description: string
    priceCents: number
    sku: string
    stock: number
    categoryId?: string
    images?: string[]
  }): Promise<Product> {
    const createdProduct = await this.productRepo.create({
      ...data,
      images: data.images ? JSON.stringify(data.images) : "[]",
    })

    if (data.stock > 0) {
      await this.inventoryRepo.createMovement({
        productId: createdProduct.id,
        type: "ADD",
        quantity: data.stock,
        note: "Initial stock",
      })
    }

    return {
      ...createdProduct,
      images: parseProductImages(createdProduct.images),
      metadata: createdProduct.metadata as Record<string, unknown> || undefined,
    }
  }

  async updateProduct(
    id: string,
    data: {
      title?: string
      slug?: string
      description?: string
      priceCents?: number
      sku?: string
      categoryId?: string
      images?: string[]
    },
  ): Promise<Product> {
    const updateData: any = { ...data }
    if (data.images) {
      updateData.images = JSON.stringify(data.images)
    }

    const updatedProduct = await this.productRepo.update(id, updateData)
    
    return {
      ...updatedProduct,
      images: parseProductImages(updatedProduct.images),
      metadata: updatedProduct.metadata as Record<string, unknown> || undefined,
    }
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepo.delete(id)
  }

  async adjustStock(id: string, quantity: number, note?: string): Promise<Product> {
    const product = await this.productRepo.updateStock(id, quantity)

    await this.inventoryRepo.createMovement({
      productId: id,
      type: "ADJUST",
      quantity,
      note,
    })

    return {
      ...product,
      images: parseProductImages(product.images),
      metadata: product.metadata as Record<string, unknown> || undefined,
    }
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepo.findAll()
  }

  async getProductsByCategory(categorySlug: string, params?: {
    page?: number
    limit?: number
  }): Promise<PaginationResult<Product>> {
    return this.listProducts({
      ...params,
      category: categorySlug,
    })
  }
}
