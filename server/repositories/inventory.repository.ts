import { prisma } from "@/lib/prisma"
import type { InventoryMovementType } from "@prisma/client"

export class InventoryRepository {
  async createMovement(data: {
    productId: string
    type: InventoryMovementType
    quantity: number
    note?: string
  }) {
    return prisma.inventoryMovement.create({ data })
  }

  async findByProduct(productId: string, limit = 50) {
    return prisma.inventoryMovement.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { product: true },
    })
  }

  async findAll(params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {}

    const [movements, total] = await Promise.all([
      prisma.inventoryMovement.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: { product: true },
      }),
      prisma.inventoryMovement.count(),
    ])

    return { movements, total }
  }
}
