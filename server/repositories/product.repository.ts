import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class ProductRepository {
  async findAll(params?: {
    skip?: number
    take?: number
    where?: Prisma.ProductWhereInput
    orderBy?: Prisma.ProductOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params || {}

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        where,
        orderBy,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])

    return { products, total }
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    })
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: { category: true },
    })
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    })
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } })
  }

  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    })
  }
}
