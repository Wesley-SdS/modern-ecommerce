import { prisma } from "@/lib/prisma"
import type { Prisma, Category } from "@prisma/client"

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: "asc" }
    })
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug }
    })
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id }
    })
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data })
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id }
    })
  }

  async findWithProductCount(): Promise<(Category & { _count: { products: number } })[]> {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: "asc" }
    })
  }
}